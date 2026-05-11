use strict;
use warnings;

my $file = 'app/Http/Controllers/Admin/UserController.php';
open(my $fh, '<', $file) or die $!;
my $content = do { local $/; <$fh> };
close($fh);

my $method = <<'PHP';
    public function getCompanyTemplates()
    {
        $user = auth()->guard('user-api')->user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $companyName = $user->company_name;
        
        // TODO: Migrate to company_id FK on users table to eliminate string-match fragility
        $company = Company::where('name', $companyName)->first();
        
        $fallback = [
            'allowed_templates' => ['ksr', 'ksr_house1', 'ksr_house2', 'ksr_apex_house', 'ksr_ligi_house', 'ksr_cfglobal_house'],
            'default_focus_air' => 'ksr',
            'default_house_air' => 'ksr_house1'
        ];

        if (!$company || !$company->templates_config) {
            return response()->json($fallback);
        }

        return response()->json($company->templates_config ?: $fallback);
    }
PHP

# Replace final closing brace
$content =~ s/\}\s*$/\n$method\}\n/s;

open($fh, '>', $file) or die $!;
print $fh $content;
close($fh);
