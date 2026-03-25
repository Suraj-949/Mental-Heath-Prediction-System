import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="predictionrecord",
            name="entry_date",
            field=models.DateField(
                db_index=True,
                default=django.utils.timezone.localdate,
            ),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="predictionrecord",
            name="entry_source",
            field=models.CharField(
                choices=[
                    ("prediction", "Prediction"),
                    ("checkin", "Daily check-in"),
                    ("manual", "Manual entry"),
                ],
                default="prediction",
                max_length=20,
            ),
            preserve_default=False,
        ),
    ]
